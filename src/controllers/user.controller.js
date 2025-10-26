import { ApiResponse } from "../utils/ApiResponse.js";


const getHello = async (req, res) => {
    return res
        .json(                                                            
            "User registered & logged in successfully"
        );
} 

export { getHello }                                                                                                                                                                         