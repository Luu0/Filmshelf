namespace FilmShelf_App.Models.User.DTO
{
    public class LoginResponseDTO
    {
        public string Token { get; set; } = null!;
        public UserWithoutPasswordDTO User { get; set; } = null!; //mapear a dto sin contra
    }
}
