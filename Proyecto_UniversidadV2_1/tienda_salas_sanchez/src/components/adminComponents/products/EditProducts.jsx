import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { LogoForm } from "../../header/logo";
import { Upload, X, AlertCircle, CheckCircle, Package, DollarSign, Loader } from "lucide-react";

export default function EditProducts() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    
    const [data, setData] = useState({
        product_name: "",
        description: "",
        slug: "",
        price: "",
        images: null,
        stock: '',
        category: '',
        is_available: true,
    });

    useEffect(() => {
        fetchProduct();
        fetchCategories();
    }, [id]);

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:8000/api/productos/${id}/`);
            if (!res.ok) throw new Error('Error al cargar el producto');
            
            const productData = await res.json();
            setData({
                product_name: productData.product_name || "",
                description: productData.description || "",
                slug: productData.slug || "",
                price: productData.price || "",
                images: null, // No establecer la imagen existente aquí
                stock: productData.stock || 0,
                category: productData.category?.id || productData.category || '',
                is_available: productData.is_available !== undefined ? productData.is_available : true,
            });
            
            // Mostrar imagen existente si existe
            if (productData.images) {
                setImagePreview(productData.images);
            }
        } catch (error) {
            console.error(error);
            setError('Error al cargar el producto');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const url = "http://localhost:8000/api/categorias";
            const response = await fetch(url);
            const data = await response.json();
            setCategories(data);
        } catch (e) {
            console.log("error al cargar categorías", e);
        }
    };

    const captura = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
            const file = files[0];
            if (file) {
                // Validar tipo de archivo
                if (!file.type.startsWith('image/')) {
                    setError('Por favor selecciona un archivo de imagen');
                    return;
                }
                // Validar tamaño (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    setError('La imagen es muy grande. Máximo 5MB');
                    return;
                }
                setData({ ...data, [name]: file });
                // Crear preview
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result);
                };
                reader.readAsDataURL(file);
                setError("");
            }
        } else if (type === "checkbox") {
            setData({ ...data, [name]: e.target.checked });
        } else {
            setData({ ...data, [name]: value });
            // Generar slug automáticamente desde el nombre si se cambia
            if (name === 'product_name') {
                const slug = value.toLowerCase()
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-+|-+$/g, "");
                setData(prev => ({ ...prev, slug }));
            }
        }
    };

    const removeImage = () => {
        setData({ ...data, images: null });
        // Si había una imagen previa del producto, mantenerla
        if (imagePreview && !data.images) {
            // La imagen preview es la original del producto
            return;
        }
        setImagePreview(null);
    };

    const validateForm = () => {
        if (!data.product_name.trim()) {
            setError('El nombre del producto es requerido');
            return false;
        }
        if (!data.description.trim()) {
            setError('La descripción es requerida');
            return false;
        }
        if (!data.price || parseFloat(data.price) <= 0) {
            setError('El precio debe ser mayor a 0');
            return false;
        }
        if (data.stock === '' || parseInt(data.stock) < 0) {
            setError('El stock debe ser 0 o mayor');
            return false;
        }
        if (!data.category) {
            setError('Debes seleccionar una categoría');
            return false;
        }
        if (!data.slug.trim()) {
            setError('El slug es requerido');
            return false;
        }
        return true;
    };

    const editProductSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        const formdata = new FormData();
        formdata.append("product_name", data.product_name.trim());
        formdata.append("slug", data.slug.trim());
        formdata.append("description", data.description.trim());
        formdata.append("price", parseFloat(data.price));
        if (data.images) {
            formdata.append("images", data.images);
        }
        formdata.append("stock", parseInt(data.stock));
        formdata.append("category", data.category);
        formdata.append("is_available", data.is_available);

        const token = localStorage.getItem('accessToken');
        
        try {
            const headers = {};
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`http://localhost:8000/api/productos/${id}/`, {
                method: "PUT",
                headers: headers,
                body: formdata,
            });

            const resultado = await res.json();

            if (!res.ok) {
                const errorMessage = resultado.detail || resultado.message || 'Error al actualizar el producto';
                if (typeof errorMessage === 'object') {
                    const errors = Object.values(errorMessage).flat().join(', ');
                    setError(errors);
                } else {
                    setError(errorMessage);
                }
                setSaving(false);
                return;
            }

            setSuccess("Producto actualizado exitosamente");
            setTimeout(() => {
                navigate('/adminPanel');
            }, 1500);

        } catch (err) {
            console.error(err);
            setError("Error al actualizar el producto. Verifica tu conexión.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex flex-col items-center">
                    <Loader className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-600">Cargando producto...</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-gray-50">
                <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <div className="flex flex-col items-center mb-6">
                        <a href="/#/adminPanel">
                            <LogoForm alt="Logo de la Empresa" className="w-20 h-20 mb-2" />
                        </a>
                        <h2 className="text-2xl font-bold text-center text-gray-800">Editar Producto</h2>
                        <p className="text-sm text-gray-600 mt-1">Modifica los datos del producto</p>
                    </div>

                    {/* Mensajes de error y éxito */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
                            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                            <p className="text-red-800 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
                            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                            <p className="text-green-800 text-sm">{success}</p>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={editProductSubmit}>
                        {/* Nombre y Slug */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre del Producto <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="product_name"
                                    placeholder="Ej: Mesa de Comedor"
                                    value={data.product_name}
                                    onChange={captura}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Slug <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="slug"
                                    placeholder="Se genera automáticamente"
                                    value={data.slug}
                                    onChange={captura}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                    required
                                />
                            </div>
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                placeholder="Describe las características del producto..."
                                value={data.description}
                                onChange={captura}
                                rows="4"
                                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Imagen con preview */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Imagen del Producto
                            </label>
                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-48 object-cover rounded-lg border"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                        <p className="mb-2 text-sm text-gray-500">
                                            <span className="font-semibold">Haz clic para subir</span> o arrastra una imagen
                                        </p>
                                        <p className="text-xs text-gray-500">PNG, JPG, GIF hasta 5MB</p>
                                    </div>
                                    <input
                                        type="file"
                                        name="images"
                                        accept="image/*"
                                        onChange={captura}
                                        className="hidden"
                                    />
                                </label>
                            )}
                        </div>

                        {/* Precio y Stock */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Precio <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="price"
                                        placeholder="0.00"
                                        value={data.price}
                                        onChange={captura}
                                        step="0.01"
                                        min="0"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="number"
                                        name="stock"
                                        placeholder="0"
                                        value={data.stock}
                                        onChange={captura}
                                        min="0"
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Categoría y Disponibilidad */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={data.category}
                                    onChange={captura}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Selecciona una categoría</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.category_name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex items-center">
                                <label className="flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="is_available"
                                        checked={data.is_available}
                                        onChange={captura}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="ml-2 text-sm font-medium text-gray-700">
                                        Producto disponible
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Botones */}
                        <div className="flex gap-4 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/adminPanel')}
                                className="flex-1 px-4 py-2 font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {saving ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Guardando...
                                    </>
                                ) : (
                                    'Actualizar Producto'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}