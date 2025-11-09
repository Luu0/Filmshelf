using AutoMapper;
using FilmShelf_App.Models.User.DTO;
using FilmShelf_App.Models.User;
using FilmShelf_App.Repositories;
using System.Net;
using FilmShelf_App.Utils;
using FilmShelf_App.Enums;

namespace FilmShelf_App.Services
{
    public class UserService
    {

        private readonly IUserRepository _repo;
        private readonly IEncoderServices _encoderService;
        private readonly IMapper _mapper;
        private readonly RoleService _roleService;
        public UserService(IUserRepository repo, IEncoderServices encoderServices, IMapper mapper, RoleService roleService)
        {
            _repo = repo;
            _encoderService = encoderServices;
            _mapper = mapper;
            _roleService = roleService;
        }

        async public Task<User> GetOneByEmailOrUsername(string? email, string? username)
        {
            if (string.IsNullOrEmpty(username) && string.IsNullOrEmpty(email))
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Email and Username are empty");
            }

            var user = await _repo.GetOneAsync(x => x.Email == email || x.UserName == username);
            return user;
        }
        async public Task<List<UserWithoutPasswordDTO>> GetAll()
        {
            var users = await _repo.GetAllAsync();
            return _mapper.Map<List<UserWithoutPasswordDTO>>(users);
        }

        async public Task<UserWithoutPasswordDTO> CreateOne(RegisterDTO register)
        {
            var user = _mapper.Map<User>(register);
            user.Password = _encoderService.Encode(user.Password);
            var role = await _roleService.GetOneByName(ROLE.USER);
            user.Roles = new() { role };
            await _repo.CreateOneAsync(user);
            return _mapper.Map<UserWithoutPasswordDTO>(user);
        }
    }
}
