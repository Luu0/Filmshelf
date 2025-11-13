using FilmShelf_App.Enums;
using FilmShelf_App.Models.User;
using FilmShelf_App.Models.User.DTO;
using FilmShelf_App.Services;
using FilmShelf_App.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Security.Claims;

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

            [HttpGet("me")]
            [Authorize] 
            [ProducesResponseType(typeof(UserWithoutPasswordDTO), StatusCodes.Status200OK)]
            [ProducesResponseType(typeof(void), StatusCodes.Status401Unauthorized)]
            [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status500InternalServerError)]
            async public Task<ActionResult<UserWithoutPasswordDTO>> GetSelf()
            {
                try
                {
                    var userId = User.FindFirstValue("id");
                    if (userId == null)
                    {
                        return Unauthorized();
                    }

                    var user = await _authService.GetUserById(userId);
                    if (user == null)
                    {
                        return Unauthorized();
                    }

                    return Ok(user);
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

        // MÉTODO NUEVO: ACTUALIZAR USUARIO
        [HttpPut("users/{id}")]
        [Authorize(Roles = ROLE.ADMIN)] // Solo el Admin puede editar
        [ProducesResponseType(typeof(UserWithoutPasswordDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        async public Task<ActionResult<UserWithoutPasswordDTO>> UpdateUser(string id, [FromBody] UpdateUserDTO dto)
        {
            try
            {
                var updatedUser = await _authService.UpdateUser(id, dto);
                return Ok(updatedUser);
            }
            catch (HttpResponseError ex)
            {
                return StatusCode((int)ex.StatusCode, new HttpMessage(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new HttpMessage(ex.Message));
            }
        }

        //BORRAR USUARIO 
        [HttpDelete("users/{id}")]
        [Authorize(Roles = ROLE.ADMIN)] // Solo el Admin puede borrar
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(typeof(HttpMessage), StatusCodes.Status404NotFound)]
        async public Task<ActionResult> DeleteUser(string id)
        {
            try
            {
                // No podemos permitir que un admin se borre a sí mismo
                var selfId = User.FindFirstValue("id");
                if (selfId == id)
                {
                    throw new HttpResponseError(HttpStatusCode.BadRequest, "No puedes eliminar tu propia cuenta de administrador.");
                }

                await _authService.DeleteUser(id);
                return NoContent(); 
            }
            catch (HttpResponseError ex)
            {
                return StatusCode((int)ex.StatusCode, new HttpMessage(ex.Message));
            }
            catch (Exception ex)
            {
                return StatusCode((int)HttpStatusCode.InternalServerError, new HttpMessage(ex.Message));
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
