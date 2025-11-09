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


        new async public Task<User> GetOneAsync(Expression<Func<User, bool>>? filter = null)
        {
            IQueryable<User> query = dbSet;
            if (filter != null)
            {
                query = query.Where(filter).Include(x => x.Roles);
            }
            return await query.FirstOrDefaultAsync();

        }
    }
}
