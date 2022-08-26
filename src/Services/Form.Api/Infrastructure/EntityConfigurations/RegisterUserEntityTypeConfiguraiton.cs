using Form.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Form.Api.Infrastructure;

public class RegisterUserEntityTypeConfiguraiton : IEntityTypeConfiguration<RegisterUser>
{
    public void Configure(EntityTypeBuilder<RegisterUser> builder)
    {
        builder.ToTable("RegisterUser");

        builder.HasKey(o => o.RegisterUserId);

        builder.Property(o => o.RegisterUserId)
               .UseHiLo("register_hilo");

        builder.Property(a => a.FirstName)
             .IsRequired()
             .HasColumnType("varchar(50)");

        builder.Property(a => a.LastName)
             .IsRequired()
             .HasColumnType("varchar(50)");

        builder.Property(a => a.PhoneNumber)
                .IsRequired()
                .HasColumnType("varchar(50)");

        builder.Property(a => a.EmailAdress)
                .IsRequired()
                .HasColumnType("varchar(50)");
        
         builder.Property(a => a.WalletAdress)
                .IsRequired()
                .HasColumnType("varchar(50)");
        
        builder.Property(a => a.WalletProvider)
                .IsRequired()
                .HasColumnType("varchar(50)");
    }
}
