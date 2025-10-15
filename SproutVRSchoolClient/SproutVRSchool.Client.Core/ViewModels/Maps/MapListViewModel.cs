using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using SproutVRSchool.Client.Core.Models.Maps;
using System.Collections.ObjectModel;

namespace SproutVRSchool.Client.Core.ViewModels.Maps
{
    public partial class MapListViewModel : ObservableObject
    {
        private List<MapListModel> _allMaps;

        // notify to UI about changes
        [ObservableProperty]
        private ObservableCollection<MapListModel> _maps;

        [ObservableProperty]
        private ObservableCollection<string> _subjects;

        [ObservableProperty]
        private string _selectedSubject = "All";

        public MapListViewModel()
        {
            
            // init sample data
            LoadData();
        }

        // RelayCommand will auto create ICommand named FilterBySubjectCommand
        [RelayCommand]
        private void FilterBySubject(string subject)
        {
            SelectedSubject = subject;

            if (subject == "All")
            {
                Maps = new ObservableCollection<MapListModel>(_allMaps);
            }
            else
            {
                var filteredMaps = _allMaps.Where(l => l.Subject == subject).ToList();
                Maps = new ObservableCollection<MapListModel>(filteredMaps);
            }
        }

        [RelayCommand]
        private async Task AddNewMap()
        {
            // Logic to navigate to Add Map Page
            // EX: await Shell.Current.GoToAsync("AddMapPage");
            System.Diagnostics.Debug.WriteLine("Navigate to Add Map page.");
        }

        [RelayCommand]
        private void SortMaps()
        {
            // EX: sort by map name
            var sortedMaps = Maps.OrderBy(l => l.MapName).ToList();
            Maps = new ObservableCollection<MapListModel>(sortedMaps);
            System.Diagnostics.Debug.WriteLine("Maps sorted.");
        }

        private void LoadData()
        {
            // mock data
            _allMaps = new List<MapListModel>
            {
                new MapListModel { Id = 1, Subject = "Math", MapName = "Introduction to Algebra", VrLessonsCount = 24, ImageUrl = "image_placeholder.png" },
                new MapListModel { Id = 2, Subject = "Math", MapName = "Geometry Basics", VrLessonsCount = 18, ImageUrl = "image_placeholder.png" },
                new MapListModel { Id = 3, Subject = "Biology", MapName = "The Human Cell", VrLessonsCount = 32, ImageUrl = "image_placeholder.png" },
                new MapListModel { Id = 4, Subject = "Biology", MapName = "Photosynthesis", VrLessonsCount = 20, ImageUrl = "image_placeholder.png" },
                new MapListModel { Id = 5, Subject = "Chemistry", MapName = "The Periodic Table", VrLessonsCount = 28, ImageUrl = "image_placeholder.png" },
                new MapListModel { Id = 6, Subject = "Chemistry", MapName = "Chemical Reactions", VrLessonsCount = 22, ImageUrl = "image_placeholder.png" }
            };

            var newSubjects = new ObservableCollection<string>
        {
            "All", "Math", "Biology", "Chemistry"
        };
            // assign value to Subjects (property that Source Generator created)
            Subjects = newSubjects;

            Maps = new ObservableCollection<MapListModel>(_allMaps);
        }
    }
}