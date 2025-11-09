using FilmShelf_App.Config;
using FilmShelf_App.Models.Role;

namespace FilmShelf_App.Repositories
{
    public interface IRoleRepository : IRepository<Role> { }
    public class RoleRepository : Repository<Role>, IRoleRepository
    {
        private readonly ApplicationDbContext _contextDB;
        public RoleRepository(ApplicationDbContext contextDB) : base(contextDB)
        {
            _contextDB = contextDB;
        }
    }
}
