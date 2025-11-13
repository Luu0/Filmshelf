using FilmShelf_App.Config;
using FilmShelf_App.Models.User;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;
using System.Linq;

namespace FilmShelf_App.Repositories
{
    public interface IUserRepository : IRepository<User> { }
    public class UserRepository : Repository<User>, IUserRepository
    {

        private readonly ApplicationDbContext _contextDB;

        public UserRepository(ApplicationDbContext contextDB) : base(contextDB)
        {
            _contextDB = contextDB;

        }
        public override async Task<User> GetOneAsync(Expression<Func<User, bool>>? filter = null)
        {
            IQueryable<User> query = dbSet;
            if (filter != null)
            {
                // Ahora sí se cargan los roles
                query = query.Where(filter).Include(x => x.Roles);
            }
            return await query.FirstOrDefaultAsync();
        }

        // Esto es para que la tabla del admin panel también muestre los roles
        public override async Task<IEnumerable<User>> GetAllAsync(Expression<Func<User, bool>>? filter = null)
        {
            IQueryable<User> query = dbSet;
            if (filter != null)
            {
                query = query.Where(filter);
            }

            // Le decimos que incluya los roles al traer TODOS los usuarios
            return await query.Include(x => x.Roles).ToListAsync();
        }
    }
}