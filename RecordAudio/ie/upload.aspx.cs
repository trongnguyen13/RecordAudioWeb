using System;
using System.IO;

namespace RecordAudio.ie
{
    public partial class upload : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            if(Request.InputStream.Length > 0)
            {
                save();
            }
        }

        private void save()
        {
            using (BinaryReader br = new BinaryReader(Request.InputStream))
            {
                byte[] bytes = br.ReadBytes((int)Request.InputStream.Length);

                string fileName = Request.QueryString["filename"];

                FileStream fs = new FileStream(Server.MapPath("/ie/upload/") + fileName, FileMode.Create);

                BinaryWriter bw = new BinaryWriter(fs);

                bw.Write(bytes);

                bw.Flush();

                fs.Close();
            }
        }
    }
}