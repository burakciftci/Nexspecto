using System.ComponentModel.DataAnnotations;

namespace Form.Api.Models.Enums
{
    public enum FormStatusType
    {
        [Display(Name = "Onay Bekleniyor")]
        ApproveRequired = 1,

        [Display(Name = "Onaylandı")]
        Approve = 2,

        [Display(Name = "Rededildi")]
        Rejected = 3
    }
}



