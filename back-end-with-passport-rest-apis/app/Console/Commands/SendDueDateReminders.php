
namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Task;
use App\Events\TaskDueDateReminder;
use Carbon\Carbon;

class SendDueDateReminders extends Command
{
    protected $signature = 'reminders:send';

    public function handle()
    {
        $tasks = Task::where('due_date', Carbon::tomorrow())->get();

        foreach ($tasks as $task) {
            event(new TaskDueDateReminder($task));
        }
    }
}
