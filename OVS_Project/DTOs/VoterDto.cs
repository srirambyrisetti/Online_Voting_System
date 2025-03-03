using System.ComponentModel.DataAnnotations;

namespace OVS_Project.DTOs
{
    public class VoterDto
    {
        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [StringLength(100)]
        public string Password { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

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
    }
}
