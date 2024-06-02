<?php

namespace App\Listeners;

use App\Events\TaskDueDateReminder;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Mail;

class SendTaskDueDateReminder implements ShouldQueue
{
    public function handle(TaskDueDateReminder $event)
    {
        $task = $event->task;
        $email = $task->user->email;

        Mail::raw("Reminder: The task '{$task->name}' is due on {$task->due_date}.", function($message) use ($email) {
            $message->to($email)
                    ->subject('Task Due Date Reminder');
        });
    }
}

