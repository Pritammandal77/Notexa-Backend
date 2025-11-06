// import mongoose, { Schema } from "mongoose";
// import jwt from "jsonwebtoken"
// import bcrypt from "bcrypt"

// const userSchema = new Schema(
//     {
//         googleId: {
//             type: String,
//             index: true
//         },
//         fullName: {
//             type: Number,
//             required: true,
//         },
//         email: {
//             type: String,
//             required: true,
//             unique: true,
//             trim: true
//         },
//         password: {
//             type: String,
//             required: true
//         },
//         refreshToken: {
//             type: String
//         },
//         profilePicture: {
//             type: String,
//         },
//         aboutUser: {
//             type: String,
//             required: true,
//             default: ""
//         },
//         linkedinLink: {
//             type: String,
//             trim: true,
//             default: ""
//         },
//     },
//     {
//         timestamps: true
//     }
// )


// //it is a middleware , it encrypts the password just before saving it in db
// userSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) return next()

//     //to hide the real password
//     this.password = await bcrypt.hash(this.password, 10)
//     next()
// })

// userSchema.methods.isPasswordCorrect = async function (password) {
//     return await bcrypt.compare(password, this.password)
// }

// userSchema.methods.generateAccessToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id,
//             email: this.email,
//             name: this.name,
//             userName: this.userName,
//         },
//         process.env.ACCESS_TOKEN_SECRET,
//         {
//             expiresIn: process.env.ACCESS_TOKEN_EXPIRY
//         }
//     )
// }

// userSchema.methods.generateRefreshToken = function () {
//     return jwt.sign(
//         {
//             _id: this._id,
//         },
//         process.env.REFRESH_TOKEN_SECRET,
//         {
//             expiresIn: process.env.REFRESH_TOKEN_EXPIRY
//         }
//     )
// }


// export const User = mongoose.model("user", userSchema)



import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
    {
        googleId: {
            type: String,
            index: true,
            default: null,
        },
        fullName: {
            type: String, // ✅ was Number before — fixed to String
            required: function () {
                return !this.googleId; // required only if not a Google user
            },
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        password: {
            type: String,
            required: function () {
                return !this.googleId; // Google users don't need a password
            },
        },
        refreshToken: {
            type: String,
        },
        profilePicture: {
            type: String,
            default: "",
        },
        aboutUser: {
            type: String,
            default: "",
        },
        linkedinLink: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    }
);

export const User = mongoose.model("User", userSchema)

