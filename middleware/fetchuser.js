// process.loadEnvFile()
const jwt = require('jsonwebtoken');
// secret key for added security for authentication 

const fetchuser = (req, res, next) => {
    let authtok = req.header("auth-token");
    if(!authtok){
        res.status(401).json({ error: "Unauthorized" });
    }
    try {
        const decodedData = jwt.verify(authtok, process.env.NOTETRACK_APP_SECRET_KEY);
        req.user = decodedData.user;
        next();
    } catch (error) {
        console.error("Error verifying JWT token:", error.message);
        res.status(401).json({ error: "Unauthorized" });
    }
}

module.exports = fetchuser;
