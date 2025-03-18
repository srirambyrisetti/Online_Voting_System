using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OVS_Project.DTOs;
using OVS_Project.Models;
using OVS_Project.Service;

namespace OVS_Project.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoterController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService;
        private readonly ILogger<VoteController> _logger;
        public VoterController(AppDbContext context, TokenService tokenService, ILogger<VoteController> logger)
        {
            _context = context;
            _tokenService = tokenService;
            _logger = logger;
        }
        [HttpGet("AllVoters")]
        public async Task<IActionResult> ViewVoters()
        {
            var voters = await _context.Voters.ToListAsync();
            return Ok(voters);
        }

        // Register a new voter
        [HttpPost("register")]
        public IActionResult Register([FromBody] VoterDto voterDto)
        {
            if (_context.Users.Any(u => u.Username == voterDto.Username || u.Email == voterDto.Email))
            {
                return BadRequest("Username or Email already exists.");
            }

            var voter = new Voter
            {
                Username = voterDto.Username,
                Password = voterDto.Password,
                Email = voterDto.Email,
                Age = voterDto.Age,
                Constituency = voterDto.Constituency,
                PhoneNumber = voterDto.PhoneNumber,
                Address = voterDto.Address,
                Gender = voterDto.Gender,
                Role = "Voter",
                RegistrationDate = DateTime.Now,
                VoterId = GenerateUniqueVoterId()
            };

            _context.Users.Add(voter);
            _context.SaveChanges();

            return Ok(new { VoterId = voter.VoterId });
        }



        private string GenerateUniqueVoterId()
        {
            const string prefix = "AP40CA";
            const int suffixLength = 4;
            string voterId;
            do
            {
                voterId = prefix + GenerateRandomNumber(suffixLength);
            } while (_context.Users.Any(u => (u as Voter).VoterId == voterId));
            return voterId;
        }

        private string GenerateRandomNumber(int length)
        {
            using (var rng = new RNGCryptoServiceProvider())
            {
                var bytes = new byte[length];
                rng.GetBytes(bytes);
                var result = new StringBuilder(length);
                foreach (var b in bytes)
                {
                    result.Append(b % 10);
                }
                return result.ToString();
            }
        }

        //// Voter login
        //[HttpPost("login")]
        //public IActionResult Login([FromBody] LoginDto loginDto)
        //{
        //    var voter = _context.Users.SingleOrDefault(u => u.Email == loginDto.Email && u.Password == loginDto.Password && u.Role == "Voter");

        //    if (voter == null)
        //    {
        //        return Unauthorized();
        //    }

        //    var token = _tokenService.GenerateToken(voter.Username, voter.Role);
        //    return Ok(new { Token = token });
        //}
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var voter = _context.Voters.SingleOrDefault(u => u.Email == loginDto.Email && u.Password == loginDto.Password && u.Role == "Voter");

            if (voter == null)
            {
                return Unauthorized();
            }

            var token = _tokenService.GenerateToken(voter.Username, voter.Role);

            var returnData = new
            {
                userid = voter.UserId,
                Username = voter.Username,
                Email = voter.Email,
                Constituency = voter.Constituency,
                Role = "Voter",
                VoterId = voter.VoterId,
                jwttoken = token
            };

            return Ok(returnData);
        }

        // View all elections
        [HttpGet("view-elections")]
        public async Task<IActionResult> ViewElections()
        {
            var elections = await _context.Elections.ToListAsync();
            return Ok(elections);
        }

        // Cast a vote
        //[HttpPost("cast-vote")]
        //[HttpPost]
        //public async Task<IActionResult> CastVote(VoteDto voteDto)
        //{
        //    // Ensure the voter has not already voted in this election
        //    var existingVote = await _context.Votes
        //        .FirstOrDefaultAsync(v => v.UserId == voteDto.UserId && v.Candidate.ElectionId == voteDto.ElectionId);

        //    if (existingVote != null)
        //    {
        //        return BadRequest(new { message = "You have already voted in this election" });
        //    }

        //    var vote = new Vote
        //    {
        //        UserId = voteDto.UserId,
        //        CandidateId = voteDto.CandidateId,
        //        VoteDate = DateTime.Now
        //    };

        //    _context.Votes.Add(vote);
        //    await _context.SaveChangesAsync();
        //    return Ok(new { message = "Vote cast successfully" });
        //}
    }
}
