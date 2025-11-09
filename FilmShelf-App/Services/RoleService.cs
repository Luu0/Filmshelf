using FilmShelf_App.Repositories;
using System.Net;
using FilmShelf_App.Models.Role;
using FilmShelf_App.Utils;

namespace FilmShelf_App.Services
{
    public class RoleService
    {
        private readonly IRoleRepository _repo;

        public RoleService(IRoleRepository repo)
        {
            _repo = repo;
        }

        public async Task<Role> GetOneByName(string name)
        {
            var role = await _repo.GetOneAsync(x => x.Name == name);
            if (role == null)
            {
                throw new HttpResponseError(HttpStatusCode.NotFound, $"Role {name} doesn´t exists");
            }
            return role;
        }
    }
}
