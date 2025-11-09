using System.ComponentModel.DataAnnotations;

namespace FilmShelf_App.Models.User.DTO
{
    public class LoginDTO
    {
        [Required]
        [MinLength(3)]
        public string EmailOrUsername { get; set; } = null!;
        [Required]
        [MinLength(8)]
        public string Password { get; set; } = null!;
    }
}
