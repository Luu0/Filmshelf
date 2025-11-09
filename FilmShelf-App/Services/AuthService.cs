using AutoMapper;
using FilmShelf_App.Models.User.DTO;
using FilmShelf_App.Models.User;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using FilmShelf_App.Utils;
namespace FilmShelf_App.Services
{
    public class AuthService
    {
        private readonly UserService _userService;
        private readonly IEncoderServices _encoderService;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;
        internal readonly string _secret;

        public AuthService(UserService userService, IEncoderServices encoderService, IMapper mapper, IConfiguration config)
        {
            _userService = userService;
            _encoderService = encoderService;
            _mapper = mapper;
            _config = config;
            _secret = _config.GetSection("Secret:JWT")?.Value?.ToString() ?? string.Empty;

        }

        async public Task<List<UserWithoutPasswordDTO>> GetUsers() 
        {
            return await _userService.GetAll();
        }

        async public Task<UserWithoutPasswordDTO> Register(RegisterDTO register) 
        {
            var user = await _userService.GetOneByEmailOrUsername(register.Email, register.UserName);
            if (user != null)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "User already exists");

            }
            var created = await _userService.CreateOne(register);
            return created;
        }



        async public Task<LoginResponseDTO> Login(LoginDTO login, HttpContext context)
        {
            string datum = login.EmailOrUsername;
            var user = await _userService.GetOneByEmailOrUsername(datum, datum);

            if (user == null)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Invalid Credentials");
            }
            bool IsMatch = _encoderService.Verify(login.Password, user.Password);
            if (!IsMatch)
            {
                throw new HttpResponseError(HttpStatusCode.BadRequest, "Invalid Credentials");

            }

            await SetCookie(user, context);
            string token = GenerateJwt(user);

            return new LoginResponseDTO
            {
                Token = token,
                User = _mapper.Map<User, UserWithoutPasswordDTO>(user)
            };

        }

        public async Task LogOut(HttpContext context)
        {
            await context.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }

        public string GenerateJwt(User user)
        {
            var key = Encoding.UTF8.GetBytes(_secret);
            var symmetricKey = new SymmetricSecurityKey(key);

            var credentials = new SigningCredentials(
                symmetricKey,
                SecurityAlgorithms.HmacSha256Signature
            );

            var claims = new ClaimsIdentity();
            claims.AddClaim(new Claim("id", user.Id.ToString()));

            if (user.Roles != null || user.Roles?.Count > 0)
            {
                foreach (var role in user.Roles)
                {
                    var claim = new Claim(ClaimTypes.Role, role.Name);
                    claims.AddClaim(claim);
                }
            }

            var tokenDescriptor = new SecurityTokenDescriptor()
            {
                Subject = claims,
                Expires = DateTime.UtcNow.AddDays(1),
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var tokenConfig = tokenHandler.CreateToken(tokenDescriptor);
            string token = tokenHandler.WriteToken(tokenConfig);
            return token;
        }

        async public Task SetCookie(User user, HttpContext context)
        {
            var claims = new List<Claim>
            {
                new Claim("id", user.Id.ToString())
            };
            if (user.Roles != null || user.Roles?.Count > 0)
            {
                foreach (var role in user.Roles)
                {
                    var claim = new Claim(ClaimTypes.Role, role.Name);
                    claims.Add(claim);
                }
            }
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await context.SignInAsync(
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    principal,
                    new AuthenticationProperties
                    {
                        IsPersistent = true,
                        ExpiresUtc = DateTime.UtcNow.AddDays(1)
                    }



                );
        }
    }
}
