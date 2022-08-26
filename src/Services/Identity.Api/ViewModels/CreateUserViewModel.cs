namespace Identity.Api.ViewModels;

public class CreateUserViewModel 
{
    public string Email { get; set; }
    public string Name { get; set; }
    public string PhoneNumber { get; set; }
    public string IdentificationNumber { get; set; }
    public string Role { get; set; } = "Customer";
}