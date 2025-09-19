//middleware function in the application’s request-response cycle. They're used to modify req and res, run logic, or end the cycle.
//Middleware is like a helper function that runs in the middle when a request comes to your server — before sending back the final response.
//best example is like the TollBooth in the highway.when you enter the highway you need to pay the toll and then you can go to your destination.
import jwt from "jsonwebtoken";
export const isAuthenticated = async (req, res, next) => {//here in this function the next is used for the next router to call
    try {//if the token is not provided or the token is invalid 
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({
                message: "User not authenticated",
                success: false,
            });
        }
        //token is existed and decoded if any error we use this function
        const decode = await jwt.verify(token, process.env.SECRET_KEY);
        if (!decode) {
            return res.status(401).json({
                message: "Invalid token",
                success: false,
            });
        }
        //decoded hash code is correct
        req.id = decode.userId;
        next();
    } catch (error) {
        console.log(error);
    }
};
export default isAuthenticated;