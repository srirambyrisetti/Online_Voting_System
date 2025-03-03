using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OVS_Project.DTOs;
using OVS_Project.Models;

namespace OVS_Project.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class CandidateController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CandidateController(AppDbContext context)
        {
            _context = context;
        }

        // Get all candidates
        [HttpGet]
        public async Task<IActionResult> GetCandidates()
        {
            var candidates = await _context.Candidates
                .Select(c => new CandidateDto
                {
                    CandidateId = c.CandidateId,
                    Name = c.Name,
                    Party = c.Party,
                    ElectionId = c.ElectionId,
                    Constituency = c.Constituency
                })
                .ToListAsync();
            return Ok(candidates);
        }

        // Get candidate by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCandidate(int id)
        {
            var candidate = await _context.Candidates
                .Select(c => new CandidateDto
                {
                    CandidateId = c.CandidateId,
                    Name = c.Name,
                    Party = c.Party,
                    ElectionId = c.ElectionId,
                    Constituency = c.Constituency
                })
                .FirstOrDefaultAsync(c => c.CandidateId == id);

            if (candidate == null)
            {
                return NotFound();
            }
            return Ok(candidate);
        }

        // Create a new candidate
        [HttpPost]
        public async Task<IActionResult> CreateCandidate(CandidateDto candidateDto)
        {
            // Check if the election exists
            var election = await _context.Elections.FindAsync(candidateDto.ElectionId);
            if (election == null)
            {
                return BadRequest(new { message = "Invalid ElectionId" });
            }

            // Check if a candidate from the same party is already registered for the same constituency in the given election
            var existingCandidate = await _context.Candidates
                .FirstOrDefaultAsync(c => c.Party == candidateDto.Party && c.Constituency == candidateDto.Constituency && c.ElectionId == candidateDto.ElectionId);

            if (existingCandidate != null)
            {
                return BadRequest(new { message = "A candidate from this party is already registered for this constituency in the given election" });
            }

            var candidate = new Candidate
            {
                Name = candidateDto.Name,
                Party = candidateDto.Party,
                ElectionId = candidateDto.ElectionId,
                Constituency = candidateDto.Constituency
            };

            _context.Candidates.Add(candidate);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Candidate created successfully" });
        }

        // Update an existing candidate
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCandidate(int id, CandidateDto candidateDto)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return NotFound();
            }

            candidate.Name = candidateDto.Name;
            candidate.Party = candidateDto.Party;
            candidate.ElectionId = candidateDto.ElectionId;

            _context.Candidates.Update(candidate);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Candidate updated successfully" });
        }

        // Delete a candidate
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCandidate(int id)
        {
            var candidate = await _context.Candidates.FindAsync(id);
            if (candidate == null)
            {
                return NotFound();
            }

            _context.Candidates.Remove(candidate);
            await _context.SaveChangesAsync();
            return Ok(new { message = "Candidate deleted successfully" });
        }
    }
}
