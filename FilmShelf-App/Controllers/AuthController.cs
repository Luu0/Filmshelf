using FilmShelf_App.Models.User.DTO;
using FilmShelf_App.Models.User;
using FilmShelf_App.Services;
using FilmShelf_App.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using FilmShelf_App.Enums;

namespace FilmShelf_App.Controllers
{

        [Route("api/filmshelf")]
        [ApiController]
        public class AuthController : ControllerBase
        {
            private readonly AuthService _authService;
            public AuthController(AuthService authService)
            {
                _authService = authService;
            }


            [HttpPost("register")]
            [ProducesResponseType(typeof(User), StatusCodes.Status201Created)]
            [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status400BadRequest)]
            [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
            async public Task<ActionResult<User>> Register([FromBody] RegisterDTO register)
            {
                try
                {
                    var created = await _authService.Register(register);
                    return Created("Register", created);

                }
                catch (HttpResponseError ex)
                {
                    return StatusCode(

                        (int)ex.StatusCode,
                        new HttpMessage(ex.Message));
                }
                catch (Exception ex)
                {
                    return StatusCode
                    (
                        (int)HttpStatusCode.InternalServerError,
                        new HttpMessage(ex.Message)

                    );
                }
            }



            [HttpPost("login")]
            [ProducesResponseType(typeof(LoginResponseDTO), StatusCodes.Status200OK)]
            [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status400BadRequest)]
            [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
            async public Task<ActionResult<User>> Login([FromBody] LoginDTO login)
            {
                try
                {
                    var res = await _authService.Login(login, HttpContext);
                    return Ok(res);

                }
                catch (HttpResponseError ex)
                {
                    return StatusCode(

                        (int)ex.StatusCode,
                        new HttpMessage(ex.Message));
                }
                catch (Exception ex)
                {
                    return StatusCode
                    (
                        (int)HttpStatusCode.InternalServerError,
                        new HttpMessage(ex.Message)

                    );
                }


            }



            [HttpPost("logout")]
            [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
            [ProducesResponseType(typeof(void), StatusCodes.Status401Unauthorized)]
            [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
            async public Task<ActionResult<User>> LogOut()
            {
                try
                {
                    await _authService.LogOut(HttpContext);
                    return Ok();

                }
                catch (Exception ex)
                {
                    return StatusCode(

                        (int)HttpStatusCode.InternalServerError,
                        new HttpMessage(ex.Message));
                }


            }


            [HttpGet("health")]
            [Authorize]
            [ApiExplorerSettings(IgnoreApi = true)]
            public bool Health()
            {
                return true;
            }


            [HttpGet("users")]
            [Authorize(Roles = $"{ROLE.MOD}, {ROLE.ADMIN}")]
            async public Task<ActionResult<List<UserWithoutPasswordDTO>>> GetUsers()
            {
                try
                {
                    var users = await _authService.GetUsers();
                    return Ok(users);

                }
                catch (HttpResponseError ex)
                {
                    return StatusCode(

                        (int)ex.StatusCode,
                        new HttpMessage(ex.Message));
                }
                catch (Exception ex)
                {
                    return StatusCode(

                        (int)HttpStatusCode.InternalServerError,
                        new HttpMessage(ex.Message));
                }


            }





        }

    
}
