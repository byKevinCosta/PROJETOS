const jwt = require('jsonwebtoken');

class Autenticador
{

    autenticar(req,res,next)
    {
        const authHeader = req.headers.authorization;
        if(!authHeader?.startsWith('Bearer ')){
            return res.status(401).json({
                mensagem: "Token não informado"
            })
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = payload;
            next()
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mensagem: "Token inválido ou expirado"
            })
        }
    }

    autenticarAdm(req,res,next)
    {
        const authHeader = req.headers.authorization;
        if(!authHeader?.startsWith('Bearer ')){
            return res.status(401).json({
                mensagem: "Token não informado"
            })
        }

        const token = authHeader.split(' ')[1];

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.usuario = payload;
            if (!payload.isAdm)
            {
                return res.status(401).json({
                mensagem: "Permissão insuficiente!"
            })
            }
            next()
            
        } catch (error) {
            console.error(error);
            return res.status(500).json({
                mensagem: "Token inválido ou expirado"
            })
        }
    }
}
module.exports = Autenticador;