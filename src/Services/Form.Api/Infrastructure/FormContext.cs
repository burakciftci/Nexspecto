
using Form.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Form.Api.Infrastructure;
public class FormContext : DbContext
{
    public FormContext(DbContextOptions<FormContext> options)
        : base(options)
    {
    }
    public DbSet<RegisterUser> RegisterUsers { get; set; }
    public DbSet<FormUser> FormUsers { get; set; }
    public DbSet<TokenPrice> TokenPricies { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        builder.ApplyConfiguration(new RegisterUserEntityTypeConfiguraiton());
        builder.ApplyConfiguration(new FormUserEntityTypeConfiguraiton());
        builder.ApplyConfiguration(new TokenPriceEntityTypeConfiguration());
    }

}