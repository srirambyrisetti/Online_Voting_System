using System.ComponentModel.DataAnnotations;

namespace OVS_Project.Models
{
    public class Voter : User
    {
        [Required]
        [Range(18, 120)]
        public int Age { get; set; }

        [Required]
        [StringLength(100)]
        public string Constituency { get; set; }

        [StringLength(10)]
        public string PhoneNumber { get; set; }

        [StringLength(200)]
        public string Address { get; set; }

        [StringLength(10)]
        public string Gender { get; set; }

        [Required]
        [StringLength(10)]
        public string VoterId { get; set; }

        [Required]
        public DateTime RegistrationDate { get; set; } = DateTime.Now;
        
    }
}
