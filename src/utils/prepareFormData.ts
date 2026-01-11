import { decamelize } from "humps";

export const prepareFormData = (data: Record<string, any>) => {
   const formData = new FormData();
   Object.entries(data).forEach(([key, value]) => {
      const decamelizedKey = decamelize(key)

      if (Array.isArray(value)) {
         value.forEach(v => {
            formData.append(decamelizedKey, v)
         })
      } else {
         switch (value) {
            case true:
               formData.append(decamelizedKey, '1');
               break;
            case false:
               formData.append(decamelizedKey, '0');
               break;
            case null:
               formData.append(decamelizedKey, '');
               break;
            default:
               formData.append(decamelizedKey, value);
               break;
         }
      }
   });
   return formData;
};
