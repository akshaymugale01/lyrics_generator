const corsMiddleware = (req, resp, next) => {

    const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000"
    ]

    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)){
        resp.setHeader("Access-Control-Allow-Origin", origin);
    }

    resp.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    resp.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type, Authorization, X-Requested-With, Cache-Control");
    resp.setHeader("Access-Control-Allow-Credentials", "true");

    if(req.method === "OPTIONS"){
        resp.sendStatus(200);
        return;
    }

    next();

}


export default corsMiddleware;