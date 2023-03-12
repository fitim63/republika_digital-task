const {pool} = require('../utils/db');

class TodoRecord {
    constructor(obj) {
        this.id = obj.id;
        this.name = obj.name;
        this.status = obj.status;
    }

    static async listAll() {
        const [results] = await pool.execute('SELECT * FROM `todos`');
        return results;
    }

    static async getOne(id) {
        const [results] = await pool.execute(
            'SELECT * FROM `todos` WHERE `id` = :id',
            {
                id,
            }
        );
        return results.length === 0 ? null : new TodoRecord(results[0]);
    }

    async insert() {
        const result = await pool.execute('INSERT INTO `todos`(`name`, `status`) VALUES(:name, :status)', {
            name: this.name,
            status: this.status
        });
        this.id = result[0].insertId
        return result
    }

    async update(id, name, status) {
        await pool.execute('UPDATE `todos` SET `name` = :name, `status` = :status WHERE `id` = :id', {
            id,
            name,
            status
        });
    }

    async updateStatus(id, status) {
        await pool.execute('UPDATE `todos` SET `status` = :status WHERE `id` = :id', {
            id,
            status,
        });
    }

    async delete() {
        await pool.execute('DELETE FROM `todos` WHERE `id` = :id', {
            id: this.id,
        });
    }
}

module.exports = {
    TodoRecord,
};