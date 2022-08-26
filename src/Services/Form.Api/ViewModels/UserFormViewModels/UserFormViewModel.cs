using System.ComponentModel.DataAnnotations;

namespace Form.Api.ViewModels;

public class UserFormViewModel
{
    [Required(ErrorMessage = "You should fill out a NetworkType.")]
    [StringLength(100)]
    public string NetworkType { get; set; }

    [Required(ErrorMessage = "You should fill out a TransactionId.")]
    [StringLength(50)]
    public string TransactionId { get; set; }
    public string RegisterUserId { get; set; }
    public IFormFile Image { get; set; }
}

public class GetUserFormViewModel
{
    public int FormUserId { get; set; }
    public string RegisterUserId { get; set; }
    public string TransactionId { get; set; }
    public string TransactionImage { get; set; }
    public decimal? ApprovedPrice { get; set; }
    public string TransactionNote { get; set; }
    public string Network { get; set; }
    public string FromStatus { get; set; }
    public int Count { get; set; }


}
public class GetUserFormFilterViewModel
{
    public string NetworkType { get; set; }
    public string TransactionId { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }  


}

public class UserFormUpdateViewModel
{
    public string FormStatus { get; set; }
    public decimal? ApprovedPrice { get; set; }
    public string TransactionNote { get; set; }

}
