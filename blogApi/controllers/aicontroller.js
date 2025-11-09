import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req,res)=>{
    try{
        const {prompt,length}=req.body;
        const userId=req.user.id;
        const plan=req.plan;
        const free_usage=req.free_usage;
        
        if(plan==='free' && free_usage>10){
        return  res.json({
          success:true,
          message:"Limit reached. Upgrade to continue."  
          })
        }

        const response = await openai.chat.completions.create({
           model: "gemini-2.0-flash",
           messages: [
           {
            role: "user",
            content: prompt,
           },
           ],
           temperature: 0.7,
           max_tokens: length ,
        });

        const content = response.choices?.[0]?.message?.content ?? 'No content generated';

        await sql `INSERT INTO creations (user_id, prompt ,content, type)
          VALUES (${userId}, ${prompt}, ${content}, 'article')`;

        if(plan==='free'){
            await clerkClient.users.updateUser(userId, {
                privateMetadata: { free_usage: free_usage + 1 }
            });
        }  
        res.json({
          success:true,
          content
        })
   }
    catch(error){
      return res.json({
            success:false,
            message:"Error in writing article",
            error:error.message
        })
    }
}