using Form.Api.Models;
using Form.Api.Models.Enums;
using Form.Api.Utility;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Form.Api.Infrastructure;

public class FormUserEntityTypeConfiguraiton : IEntityTypeConfiguration<FormUser>
{
    public void Configure(EntityTypeBuilder<FormUser> builder)
    {
        builder.ToTable("FormUser");

        builder.HasKey(o => o.FormUserId);

        builder.Property(o => o.FormUserId)
               .UseHiLo("Form_User_Hilo");

        builder.Property(a => a.TransactionId)
             .IsRequired()
             .HasColumnType("varchar(500)");

        builder.Property(a => a.RegisterUserId)
             .IsRequired()
             .HasColumnType("varchar(100)");
     
        builder.Property(a => a.TransactionNote)
             .HasColumnType("varchar(500)");

        builder.Property(a => a.Network)
             .IsRequired()
             .HasColumnType("varchar(50)")
             .HasConversion(
                 v => v.ToLowerString(),
                 s => EnumUtil.Parse<NetworkType>(s)
            );
        
        builder.Property(a => a.FromStatus)
             .IsRequired()
             .HasColumnType("varchar(50)")
             .HasConversion(
                 v => v.ToLowerString(),
                 s => EnumUtil.Parse<FormStatusType>(s)
            );
    }

 
}
