using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Nop.Core;
using Nop.Core.Domain.Catalog;
using Nop.Core.Domain.Customers;
using Nop.Services.Catalog;
using Nop.Services.Common;
using Nop.Services.Localization;
using Nop.Services.Logging;
using Nop.Services.Security;
using Nop.Services.Seo;
using Nop.Services.Stores;
using Nop.Web.Factories;
using Nop.Web.Framework.Components;
using Nop.Web.Models.Catalog;

namespace Nop.Web.Components
{
    public class HomepageCategoriesProductsViewComponent : NopViewComponent
    {
        private readonly IAclService _aclService;
        private readonly IProductModelFactory _productModelFactory;
        private readonly IProductService _productService;
        private readonly IStoreMappingService _storeMappingService;
        private readonly ICatalogModelFactory _catalogModelFactory;
        private readonly ICategoryService _categoryService;
        private readonly IPermissionService _permissionService;
        private readonly IStoreContext _storeContext;
        private readonly IWorkContext _workContext;
        private readonly IGenericAttributeService _genericAttributeService;
        private readonly IWebHelper _webHelper;
        private readonly ICustomerActivityService _customerActivityService;
        private readonly ILocalizationService _localizationService;

        public HomepageCategoriesProductsViewComponent
        (
            IAclService aclService,
            IProductModelFactory productModelFactory,
            IProductService productService,
            IStoreMappingService storeMappingService,
            ICatalogModelFactory catalogModelFactory,
            ICategoryService categoryService,
            IPermissionService permissionService,
            IStoreContext storeContext,
            IWorkContext workContext,
            IGenericAttributeService genericAttributeService,
            IWebHelper webHelper,
            ICustomerActivityService customerActivityService,
            ILocalizationService localizationService
        )
        {
            _aclService = aclService;
            _productModelFactory = productModelFactory;
            _productService = productService;
            _storeMappingService = storeMappingService;
            _catalogModelFactory = catalogModelFactory;
            _categoryService = categoryService;
            _permissionService = permissionService;
            _storeContext = storeContext;
            _workContext = workContext;
            _genericAttributeService = genericAttributeService;
            _webHelper = webHelper;
            _customerActivityService = customerActivityService;
            _localizationService = localizationService;
        }

        public async Task<IViewComponentResult> InvokeAsync()
        {
            var category = await _categoryService.GetCategoryByIdAsync(1);

            if (!await CheckCategoryAvailabilityAsync(category))
                return Content("");

            var store = await _storeContext.GetCurrentStoreAsync();

            //'Continue shopping' URL
            await _genericAttributeService.SaveAttributeAsync(await _workContext.GetCurrentCustomerAsync(),
                NopCustomerDefaults.LastContinueShoppingPageAttribute,
                _webHelper.GetThisPageUrl(false),
                store.Id);

            //activity log
            await _customerActivityService.InsertActivityAsync("PublicStore.ViewCategory",
                string.Format(await _localizationService.GetResourceAsync("ActivityLog.PublicStore.ViewCategory"), category.Name), category);

            //model
            var model = await _catalogModelFactory.PrepareCategoryModelAsync(category, new CatalogProductsCommand());

            return View(model);
        }

        private async Task<bool> CheckCategoryAvailabilityAsync(Category category)
        {
            var isAvailable = true;

            if (category == null || category.Deleted)
                isAvailable = false;

            var notAvailable =
                //published?
                category == null || 
                !category.Published ||
                //ACL (access control list) 
                !await _aclService.AuthorizeAsync(category) ||
                //Store mapping
                !await _storeMappingService.AuthorizeAsync(category);
            //Check whether the current user has a "Manage categories" permission (usually a store owner)
            //We should allows him (her) to use "Preview" functionality
            var hasAdminAccess = await _permissionService.AuthorizeAsync(StandardPermissionProvider.AccessAdminPanel) && await _permissionService.AuthorizeAsync(StandardPermissionProvider.ManageCategories);
            if (notAvailable && !hasAdminAccess)
                isAvailable = false;

            return isAvailable;
        }
    }
}