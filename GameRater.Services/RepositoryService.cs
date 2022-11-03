using GameRater.Repo;
using GameRater.Repo.Repository;
using GameRater.Services.Interfaces;
using System.Linq.Expressions;

namespace GameRater.Services
{
    public class RepositoryService<TEntity> : IRepositoryService<TEntity> where TEntity : class
    {
        private readonly IRepository<ApplicationDbContext, TEntity> repository;

        public RepositoryService(IRepository<ApplicationDbContext, TEntity> repository)
        {
            this.repository = repository;
        }


        // Get
        public IEnumerable<TEntity> Get(Expression<Func<TEntity, bool>> filter = null, Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null, string includeProperties = "")
        {
            return repository.Get(filter, orderBy, includeProperties);
        }

        // GetAll
        public IEnumerable<TEntity> GetAll()
        {
            return repository.GetAll();
        }

        // GetById
        public TEntity GetById(object id)
        {
            return repository.GetById(id);
        }

        // Insert
        public void Insert(TEntity entity)
        {
            repository.Insert(entity);
        }

        // Update
        public void Update(TEntity entity)
        {
            repository.Update(entity);
        }

        // Delete (by entity)
        public void Delete(TEntity entity)
        {
            repository.Delete(entity);
        }

        // Delete (by id)
        public void Delete(object id)
        {
            repository.Delete(id);
        }
    }
}
