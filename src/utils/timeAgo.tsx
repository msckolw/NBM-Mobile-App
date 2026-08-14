export const timeAgo = (dateString:string)=>{
    const newDate = new Date(dateString)
    const now = new Date();

    const seconds = Math.floor((now.getTime() - newDate.getTime()) / 1000)

    if (seconds < 60)
    {
        return "Just Now"
    }
    if(seconds < 3600)
    {
        return `${Math.floor(seconds/60)} mins ago`
    }
if(seconds < 86400)
{
    return `${Math.floor(seconds / 3600)} hours ago`
}
if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;

return newDate.toLocaleDateString()
}
