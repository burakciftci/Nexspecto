using System.ComponentModel.DataAnnotations;

namespace Form.Api.ViewModels;

public class UserCreateViewModel
{
    [Required(ErrorMessage = "You should fill out a user.")]
    [StringLength(100)]
    public string FirstName { get; set; }

    [Required(ErrorMessage = "You should fill out a name.")]
    [StringLength(50)]
    public string LastName { get; set; }

    [Required(ErrorMessage = "You should fill out a name.")]
    [StringLength(50)]
    public string EmailAdress { get; set; }

    [Required(ErrorMessage = "You should fill out a nick name.")]
    [StringLength(50)]
    public string PhoneNumber { get; set; }

    [Required(ErrorMessage = "You should fill out a email.")]
    [StringLength(100)]
    public string WalletAdress { get; set; }

    [Required(ErrorMessage = "You should fill out a phone.")]
    [StringLength(50)]
    public string WalletProvider { get; set; }
}

public class GetRegisterViewModel
{
    public int RegisterUserId { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string EmailAdress { get; set; }
    public string PhoneNumber { get; set; }
    public string WalletAdress { get; set; }
    public string WalletProvider { get; set; }

}
