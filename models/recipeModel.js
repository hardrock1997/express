const mongoose = require("mongoose")

const recipesSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:5
    },
    tags:Array,
    ingredients:Array,
    prepTime: Number,
    difficulty: String,
    price:{
        type:Number,
        required:true
    },
    level:{
        type:String,
        default:"medium"
    }
})

const recipeModel = mongoose.model("recipe",recipesSchema)

module.exports = recipeModel