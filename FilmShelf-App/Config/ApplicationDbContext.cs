using FilmShelf_App.Models.Role;
using FilmShelf_App.Models.User;
using Microsoft.EntityFrameworkCore;
using System.Data;
namespace FilmShelf_App.Config
{
    public class ApplicationDbContext : DbContext
    {

        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options) { }
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>().HasIndex(x => x.UserName).IsUnique();
            modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
            modelBuilder.Entity<Role>().HasIndex(x => x.Name).IsUnique();

            modelBuilder.Entity<User>()
               .HasMany(x => x.Roles)
               .WithMany()
               .UsingEntity<UserRoles>(
                   l => l.HasOne<Role>().WithMany().HasForeignKey(x => x.RoleId),
                   r => r.HasOne<User>().WithMany().HasForeignKey(x => x.UserId)
               );
            modelBuilder.Entity<Role>().HasData(
            new Role { Id = 1, Name = "Admin" },
            new Role { Id = 2, Name = "User" },
            new Role { Id = 3, Name = "Mod" });
        }
    }
}
