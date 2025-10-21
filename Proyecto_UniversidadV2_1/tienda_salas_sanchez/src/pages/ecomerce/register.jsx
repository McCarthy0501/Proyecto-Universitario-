import { motion } from "framer-motion";
import RegisterForm from "../../components/formularios/registerFrom";



function Register() {
    const animacion={
        desaparecer:{opacitty:0,x:-50},
        aparecer:{opacitty:1,x:0}
    }

    return(
        <>
            <motion.div
            variants={animacion}
            initial="desaparecer"
            whileInView="aparecer"
             transition={{ duration: 0.9, ease: "easeInOut" }}
            >
                <RegisterForm/>
            </motion.div>
        </>
    )
    
}

export default Register