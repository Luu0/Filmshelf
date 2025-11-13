using AutoMapper;
using FilmShelf_App.Models.User.DTO;
using FilmShelf_App.Models.User;
using FilmShelf_App.Repositories;
using System.Net;
using FilmShelf_App.Utils;
using FilmShelf_App.Enums;
using Microsoft.EntityFrameworkCore; 

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

        // Añadiendo funcionalidad de traer un usario por id
        async public Task<User> GetOneById(string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "User ID is empty");
            }

            if (!int.TryParse(id, out int userId))
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Invalid User ID format");
            }

            var user = await _repo.GetOneAsync(x => x.Id == userId);
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


        async public Task<User> UpdateUser(string id, UpdateUserDTO dto)
        {
            //  Busca al usuario por ID
            if (!int.TryParse(id, out int userId))
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "ID de usuario inválido.");
            }
            var user = await _repo.GetOneAsync(x => x.Id == userId);
            if (user == null)
            {
                throw new HttpResponseError(HttpStatusCode.NotFound, "Usuario no encontrado.");
            }

            if (user.Email != dto.Email) 
            {
                var existingUserByEmail = await _repo.GetOneAsync(x => x.Email == dto.Email && x.Id != userId);
                if (existingUserByEmail != null)
                {
                    throw new HttpResponseError(HttpStatusCode.BadRequest, "El Email ya está en uso por otro usuario.");
                }
            }

            // Chequeo de UserName: ¿Existe otro usuario (Id != userId) con este username?
            if (user.UserName != dto.UserName) 
            {
                var existingUserByName = await _repo.GetOneAsync(x => x.UserName == dto.UserName && x.Id != userId);
                if (existingUserByName != null)
                {
                    throw new HttpResponseError(HttpStatusCode.BadRequest, "El Nombre de Usuario ya está en uso por otro usuario.");
                }
            }

            // Actualiza los datos
            user.UserName = dto.UserName;
            user.Email = dto.Email;

            // Actualiza el ROL
            var newRole = await _roleService.GetOneByName(dto.Role);
            if (newRole == null)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "El rol especificado no existe.");
            }

            user.Roles.Clear();
            user.Roles.Add(newRole);

            // Guarda en la BD
            await _repo.UpdateOneAsync(user);
            return user;
        }

        // MÉTODO DE BORRADO 
        async public Task DeleteOneById(string id)
        {
            if (!int.TryParse(id, out int userId))
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "ID de usuario inválido.");
            }

            var user = await _repo.GetOneAsync(x => x.Id == userId);
            if (user == null)
            {
                throw new HttpResponseError(HttpStatusCode.NotFound, "Usuario no encontrado.");
            }

            await _repo.DeleteOneAsync(user);
        }
    }
}