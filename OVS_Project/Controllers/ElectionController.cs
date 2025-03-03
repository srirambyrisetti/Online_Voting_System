using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OVS_Project.DTOs;
using OVS_Project.Models;

namespace OVS_Project.Controllers
{
    [Authorize(Roles = "Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class ElectionController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ElectionController(AppDbContext context)
        {
            _context = context;
        }

        // Get all elections
        [HttpGet]
        public async Task<IActionResult> GetElections()
        {
            var elections = await _context.Elections
                .Select(e => new ElectionDto
                {
                    ElectionId = e.ElectionId,
                    Title = e.Title,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                })
                .ToListAsync();
            return Ok(elections);
        }

        // Get election by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetElection(int id)
        {
            var election = await _context.Elections
                .Select(e => new ElectionDto
                {
                    ElectionId = e.ElectionId,
                    Title = e.Title,
                    StartDate = e.StartDate,
                    EndDate = e.EndDate
                })
                .FirstOrDefaultAsync(e => e.ElectionId == id);

            if (election == null)
            {
                return NotFound();
            }
            return Ok(election);
        }

        // Create a new election
        [HttpPost]
        public async Task<IActionResult> CreateElection(ElectionDto createElectionDto)
        {
            var election = new Election
            {
                Title = createElectionDto.Title,
                StartDate = createElectionDto.StartDate,
                EndDate = createElectionDto.EndDate
            };

            _context.Elections.Add(election);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Election created successfully" });
        }

        // Update an existing election
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateElection(int id, ElectionDto electionDto)
        {
            var election = await _context.Elections.FindAsync(id);
            if (election == null)
            {
                return NotFound();
            }

            election.Title = electionDto.Title;
            election.StartDate = electionDto.StartDate;
            election.EndDate = electionDto.EndDate;

            _context.Elections.Update(election);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Election updated successfully" });
        }

        // Delete an election
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteElection(int id)
        {
            var election = await _context.Elections.FindAsync(id);
            if (election == null)
            {
                return NotFound();
            }

            _context.Elections.Remove(election);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Election deleted successfully" });
        }

       // Get election results
       //[HttpGet("{id}/results")]
       // public async Task<IActionResult> GetElectionResults(int id)
       // {
       //     var results = await _context.Votes
       //         .Where(v => v.Candidate.ElectionId == id)
       //         .GroupBy(v => v.Candidate.Name)
       //         .Select(g => new
       //         {
       //             CandidateName = g.Key,
       //             VoteCount = g.Count()
       //         })
       //         .ToListAsync();

       //     return Ok(results);
       // }

        // Get election results by constituency
        [HttpGet("results/{electionId}")]
        public async Task<IActionResult> GetElectionResults(int electionId)
        {
            var election = await _context.Elections.FindAsync(electionId);
            if (election == null)
            {
                return NotFound(new { message = "No Election Exists with the given Election ID" });
            }
            var results = await _context.Votes
                .Include(v => v.Candidate)
                .Where(v => v.Candidate.ElectionId == electionId)
                .GroupBy(v => new { v.Candidate.Constituency, v.Candidate.Name, v.Candidate.Party })
                .Select(g => new
                {
                    g.Key.Constituency,
                    CandidateName = g.Key.Name,
                    PartyName = g.Key.Party,
                    VoteCount = g.Count()
                })
                .ToListAsync();

            var groupedResults = results
                .GroupBy(r => r.Constituency)
                .ToDictionary(
                    g => g.Key,
                    g => g.OrderByDescending(r => r.VoteCount)
                          .Select(r => new
                          {
                              r.CandidateName,
                              r.PartyName,
                              r.VoteCount
                          }).ToList()
                );

            return Ok(groupedResults);
        }

        // Get election winner
        [HttpGet("winner/{electionId}")]
        public async Task<IActionResult> GetElectionWinner(int electionId)
        {
            var election = await _context.Elections.FindAsync(electionId);
            if (election == null)
            {
                return NotFound(new { message = "No Election Exists with the given Election ID" });
            }
            var results = await _context.Votes
                .Include(v => v.Candidate)
                .Where(v => v.Candidate.ElectionId == electionId)
                .GroupBy(v => new { v.Candidate.Constituency, v.Candidate.Party })
                .Select(g => new
                {
                    g.Key.Constituency,
                    PartyName = g.Key.Party,
                    VoteCount = g.Count()
                })
                .ToListAsync();

            var constituencyWinners = results
                .GroupBy(r => r.Constituency)
                .Select(g => g.OrderByDescending(r => r.VoteCount).First())
                .GroupBy(r => r.PartyName)
                .Select(g => new
                {
                    PartyName = g.Key,
                    ConstituencyCount = g.Count()
                })
                .OrderByDescending(r => r.ConstituencyCount)
                .ToList();

            var totalConstituencies = results.Select(r => r.Constituency).Distinct().Count();
            var majorityCount = totalConstituencies / 2 ;

            var winningParty = constituencyWinners.FirstOrDefault(r => r.ConstituencyCount >= majorityCount);

            if (winningParty == null)
            {
                return Ok(new { message = "No party won the majority of constituencies" });
            }

            return Ok(new { message = $"The winning party is {winningParty.PartyName} with {winningParty.ConstituencyCount} constituencies" });
        }


    }
}
