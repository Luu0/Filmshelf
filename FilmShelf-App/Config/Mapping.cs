using FilmShelf_App.Models.User.DTO;
using FilmShelf_App.Models.User;
using AutoMapper;

namespace FilmShelf_App.Config
{
    public class Mapping :Profile
    {

        public Mapping()
        {
            //Defaults
            CreateMap<int?, int>().ConvertUsing((src, dest) => src ?? dest);
            CreateMap<bool?, bool>().ConvertUsing((src, dest) => src ?? dest);
            CreateMap<string?, string>().ConvertUsing((src, dest) => src ?? dest);

            // Auth
            CreateMap<RegisterDTO, User>();
            CreateMap<User, UserWithoutPasswordDTO>().ForMember(
                dest => dest.Roles,
                opt => opt.MapFrom(e => e.Roles.Select(x => x.Name).ToList())

            );

        }
    }
}
