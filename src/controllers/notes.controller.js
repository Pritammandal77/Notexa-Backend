import { asyncHandler } from "../utils/asyncHandler.js"


const uploadNotes = asyncHandler(async (req, res) => {
    console.log(req.user._id)    
    return res 
    .status(200)
    .json(
       "Hello World"
    )
})

export {
    uploadNotes
}