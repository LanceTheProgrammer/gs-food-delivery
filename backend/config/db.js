import mongoose, { mongo } from "mongoose";

export const connectDB = async() => {
    await mongoose.connect('mongodb+srv://ljpruitt123:ktwMsgFSCFkSdbEq@cluster0.o7psl4m.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}