
namespace Form.Api.Models;
public class RegisterUser : IChangingDate
{
    public int RegisterUserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmailAdress { get; set; }
    public string PhoneNumber { get; set; }
    public string WalletAdress { get; set; }
    public string WalletProvider { get; set; }
    public DateTime CreateDate  { get; set; }
    public DateTime? LastUpdateDate  { get; set; }
}