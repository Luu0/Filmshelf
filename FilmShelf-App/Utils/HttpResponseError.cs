using System.Net;

namespace FilmShelf_App.Utils
{
    public class HttpResponseError : Exception
    {
        public string Message { get; set; }
        public HttpStatusCode StatusCode { get; set; }

        public HttpResponseError(HttpStatusCode statusCode, string message)
        {
            Message = message;
            StatusCode = statusCode;

        }
    }
}
