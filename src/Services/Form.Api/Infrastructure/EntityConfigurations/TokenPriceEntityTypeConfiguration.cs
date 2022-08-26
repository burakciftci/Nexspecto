using Form.Api.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Form.Api.Infrastructure;

public class TokenPriceEntityTypeConfiguration : IEntityTypeConfiguration<TokenPrice>
{
    public void Configure(EntityTypeBuilder<TokenPrice> builder)
    {
        builder.ToTable("TokenPrice");

        builder.HasKey(o => o.TokenPriceId);

        builder.Property(o => o.TokenPriceId)
               .UseHiLo("Token_Price_Hilo");

        builder.Property(a => a.TokenPriceCode)
                .IsRequired()
                .HasColumnType("varchar(50)");

    }
}
