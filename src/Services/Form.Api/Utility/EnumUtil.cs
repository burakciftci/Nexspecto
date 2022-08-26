
using System.ComponentModel.DataAnnotations;
using System.Reflection;
namespace Form.Api.Utility
{
    public static class EnumUtil
    {

        public static TEnum Parse<TEnum>(string v) where TEnum : struct, IConvertible
        {
            return (TEnum)Enum.Parse(typeof(TEnum), v, true);
        }
        
        public static Dictionary<int, string> GetEnumDisplayList<TEnum>() where TEnum : struct, IConvertible
        {
            var type = typeof(TEnum);

            if (!type.IsEnum)
            {
                throw new ArgumentException("TEnum must be an enum type");
            }

            var list = Enum.GetValues(type).Cast<Enum>();
            var result = new Dictionary<int, string>();
            foreach (var e in list)
            {
                
                result.Add(e.AsInteger(), e.GetDisplayNameOrDefault());
            }
            return result;

        }

        public static List<TEnum> GetList<TEnum>() where TEnum : struct, IConvertible
        {
            var type = typeof(TEnum);

            if (!type.IsEnum)
            {
                throw new ArgumentException("TEnum must be an enum type");
            }

            var list = Enum.GetValues(type).Cast<TEnum>().ToList();

            return list;

        }

        public static List<string> GetNameList<TEnum>() where TEnum : struct, IConvertible
        {
            var type = typeof(TEnum);

            if (!type.IsEnum)
            {
                throw new ArgumentException("TEnum must be an enum type");
            }

            var list = Enum.GetValues(type).Cast<Enum>();
            var result = new List<string>();
            foreach (var e in list)
            {

                result.Add(e.ToString());
            }
            return result;

        }

        public static List<string> GetLowerNameList<TEnum>() where TEnum : struct, IConvertible
        {
            var type = typeof(TEnum);

            if (!type.IsEnum)
            {
                throw new ArgumentException("TEnum must be an enum type");
            }

            var list = Enum.GetValues(type).Cast<Enum>();
            var result = new List<string>();
            foreach (var e in list)
            {

                result.Add(e.ToString().ToLowerInvariant());
            }
            return result;

        }

        public static string GetNumericValue(this Enum value)
        {
            return value?.ToString("D");
        }
        public static int AsInteger(this Enum value)
        {
            var stringVal = value.GetNumericValue();

            int result = 0;

            int.TryParse(stringVal, out result);

            return result;
        }

        public static byte AsByte(this Enum value)
        {
            var stringVal = value.GetNumericValue();

            byte result = 0;

            byte.TryParse(stringVal, out result);

            return result;
        }
        public static string GetDisplayNameOrDefault(this Enum value)
        {

            var enumType = value.GetType();
            var enumMemberName = Enum.GetName(enumType, value);
            return enumType
                .GetMemberAttribute<DisplayAttribute>(enumMemberName)
                ?.GetName()
                ?? enumMemberName;
        }

        public static int GetDisplayOrderOrDefault(this Enum value)
        {

            var enumType = value.GetType();
            var enumMemberName = Enum.GetName(enumType, value);
            return enumType
                .GetMemberAttribute<DisplayAttribute>(enumMemberName)
                ?.GetOrder()
                ?? 0;
        }

        public static string GetCodeOrDefault(this Enum value)
        {
            var enumType = value.GetType();
            var enumMemberName = Enum.GetName(enumType, value);
            return enumType
                .GetMemberAttribute<ReturnCode>(enumMemberName)
                ?.GetCode()
                ?? enumMemberName;
        }


        public static string GetDescriptionOrDefault(this Enum value)
        {

            var enumType = value.GetType();
            var enumMemberName = Enum.GetName(enumType, value);
            return enumType
                .GetMemberAttribute<DisplayAttribute>(enumMemberName)
                ?.GetDescription()
                ?? enumMemberName;
        }
        public static string ToLowerString(this Enum value)
        {
            return value.ToString().ToLowerInvariant();
        }

        public static TAttribute GetMemberAttribute<TAttribute>(this Type type, string memberName) where TAttribute : Attribute =>
         type.GetMember(memberName).SingleOrDefault()?.GetCustomAttribute<TAttribute>();

        public static string GetGroupNameOrDefault(this Enum value)
        {

            var enumType = value.GetType();
            var enumMemberName = Enum.GetName(enumType, value);
            return enumType
                .GetMemberAttribute<DisplayAttribute>(enumMemberName)
                ?.GetGroupName()
                ?? string.Empty;
        }
    }
}