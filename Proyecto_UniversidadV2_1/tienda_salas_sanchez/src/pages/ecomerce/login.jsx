import { motion } from "framer-motion";

import LoginForm from "../../components/formularios/loginForm";


function Login() {
    const animacion={
        desaparecer:{opacity:0,x:-50},
        aparecer:{opacity:1,x:0}


    }
    return(
        <>
        <motion.div
        variants={animacion}
        initial="desaparecer"
        whileInView="aparecer"
        
        transition={{ duration: 0.8, ease: "easeInOut" }}
        >
            <LoginForm/>
        </motion.div>
       
       
        
        </>
    )
    
}

export default Login