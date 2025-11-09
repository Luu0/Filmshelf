using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace FilmShelf_App.Models.Role
{
    public class Role
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Name { get; set; } = null!;
    }
    public class UserRoles
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
