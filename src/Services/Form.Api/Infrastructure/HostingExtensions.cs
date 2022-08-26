using System.Text.Json.Serialization;
using Form.Api.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace Form.Api.Infrastructure;
internal static class HostingExtensions
{

    public static WebApplication ConfigureServices(this WebApplicationBuilder builder)
    {
        var migrationsAssembly = typeof(Program).Assembly.GetName().Name;
        string connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

        builder.Services.AddControllers();
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(opt =>
        {
            opt.SwaggerDoc("v1", new OpenApiInfo { Title = "Form.Api", Version = "v1" });
            opt.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "bearer"
            });
            opt.AddSecurityRequirement(new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type=ReferenceType.SecurityScheme,
                            Id="Bearer"
                        }
                    },
                    new string[]{}
                }
            });
        });
        // builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        builder.Services.AddControllers().AddJsonOptions(x =>
                    x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve);

        builder.Services.AddDbContext<FormContext>(options =>
                    {
                        options.UseSqlServer(connectionString);
                    });

        AddInternalServices(builder);
        AddInternalOperations(builder);
        var identityUrl = builder.Configuration.GetValue<string>("IdentityUrl");
        builder.Services.AddAuthentication("Bearer")
            .AddJwtBearer(options =>
            {
                options.Authority = identityUrl;
                options.TokenValidationParameters.ValidateAudience = false;
                options.Audience = builder.Configuration.GetValue<string>("ApiName");
                options.RequireHttpsMetadata = false;
            });
        builder.Services.AddAuthorization(options =>
            options.AddPolicy("ApiScope", policy =>
            {
                policy.RequireAuthenticatedUser();
                policy.RequireClaim("scope", "form.api");
            })
        );
        return builder.Build();
    }

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "V1 Docs");

            });
        }
        using (var scope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope())
        {
            var context = scope.ServiceProvider.GetService<FormContext>();
            context.Database.Migrate();
        }
        //app.UseHttpsRedirection();
        app.UseRouting();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });        
        app.UseAuthentication();
        app.UseAuthorization();
        

        return app;
    }

    private static void AddInternalServices(WebApplicationBuilder builder)
    {
        builder.Services.AddScoped<IRegisterService, RegisterService>();  
        builder.Services.AddScoped<IFormService, FormService>();        

    }

    private static void AddInternalOperations(WebApplicationBuilder builder)
    {
     
    }
}