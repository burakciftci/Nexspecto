using System.ComponentModel.DataAnnotations;

namespace Form.Api.Models.Enums
{
    public enum NetworkType
    {
        [Display(Name = "Binance Smart Chain(BEP20)")]
        BinanceSmartChainBEP20 = 1,

        [Display(Name = "Tron (TRC20)")]
        TronTRC20 = 2,

        [Display(Name = "Ethereum (ERC20)")]
        EthereumERC20 = 3
    }
}



