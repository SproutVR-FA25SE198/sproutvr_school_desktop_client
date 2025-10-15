using Microsoft.Extensions.Logging;
using SproutVRSchool.Client.Core.ViewModels.Maps;
using SproutVRSchool.Presentations.Views.Maps;

namespace SproutVRSchool.Presentations
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                });

#if DEBUG
    		builder.Logging.AddDebug();
#endif
            // Register views
            builder.Services.AddTransient<MapListView>();

            // Register view models
            builder.Services.AddTransient<MapListViewModel>();
            return builder.Build();
        }
    }
}
